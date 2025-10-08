from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import requests
from typing import Optional, Dict, Any
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EcoWear ML Prediction API",
    description="Machine Learning API for predicting eco-friendly fashion purchase behavior",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and columns
model = None
model_columns = None

# Pydantic model for request validation
class SurveyData(BaseModel):
    age_group: str
    gender: str
    education_level: str
    monthly_income: str
    occupation: str
    aware_of_fast_fashion_impact: str
    sustainability_importance: int  # 1-5 scale
    motivation_to_buy: str
    purchased_eco_friendly_before: str
    frequency_of_purchase: str
    price_influence: int  # 1-5 scale
    brand_influence: int  # 1-5 scale
    sustainability_influence: int  # 1-5 scale
    social_influence: int  # 1-5 scale
    product_quality_influence: int  # 1-5 scale
    primary_barrier: str

class PredictionResponse(BaseModel):
    prediction: int
    will_buy: bool
    confidence_score: float
    prediction_details: Dict[str, Any]

def get_model_path(filename: str) -> str:
    """Get the correct path for model files"""
    # Check if file exists in current directory
    if os.path.exists(filename):
        return filename
    
    # Check if file exists in parent directory (during development)
    parent_path = os.path.join("..", filename)
    if os.path.exists(parent_path):
        return parent_path
    
    # If neither exists, raise an error
    raise FileNotFoundError(f"Model file {filename} not found in current or parent directory")

def load_model_and_columns():
    """Load the ML model and column structure"""
    global model, model_columns
    
    try:
        # Get model file paths
        model_path = get_model_path("eco_friendly_model.pkl")
        columns_path = get_model_path("model_columns.pkl")
        
        # Load model and columns
        logger.info(f"Loading model from: {model_path}")
        model = joblib.load(model_path)
        
        logger.info(f"Loading columns from: {columns_path}")
        model_columns = joblib.load(columns_path)
        
        logger.info("Model and columns loaded successfully")
        logger.info(f"Model type: {type(model)}")
        logger.info(f"Number of expected features: {len(model_columns)}")
        
    except FileNotFoundError as e:
        logger.error(f"Model files not found: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Model files not found: {str(e)}")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model_and_columns()

@app.get("/")
async def root():
    return {
        "message": "EcoWear ML Prediction API", 
        "status": "running",
        "model_loaded": model is not None,
        "columns_loaded": model_columns is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_ready": model is not None and model_columns is not None
    }

def prepare_data(survey_data: dict) -> pd.DataFrame:
    """
    Prepare the survey data exactly as the model was trained
    This is critical for correct predictions
    """
    try:
        logger.info("Starting data preparation")
        
        # Create DataFrame from input data
        df = pd.DataFrame([survey_data])
        logger.info(f"Initial DataFrame shape: {df.shape}")
        logger.info(f"Initial columns: {list(df.columns)}")
        
        # Process multi-select columns (motivation and barriers)
        multi_select_features = pd.DataFrame()
        
        # Handle motivation column
        motivation_col = 'What motivates you to buy eco-friendly apparel? (Select all that apply.)'
        if motivation_col in df.columns:
            motivation_dummies = df[motivation_col].str.get_dummies(sep=', ')
            motivation_dummies = motivation_dummies.add_prefix('motivation_')
            multi_select_features = pd.concat([multi_select_features, motivation_dummies], axis=1)
            df = df.drop(columns=[motivation_col])
        
        # Handle barriers column  
        barrier_col = 'What barriers prevent you from buying sustainable fashion more often?'
        if barrier_col in df.columns:
            barrier_dummies = df[barrier_col].str.get_dummies(sep=', ')
            barrier_dummies = barrier_dummies.add_prefix('barrier_')
            multi_select_features = pd.concat([multi_select_features, barrier_dummies], axis=1)
            df = df.drop(columns=[barrier_col])
        
        # Separate numerical and categorical columns
        numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
        
        logger.info(f"Numerical columns: {numerical_cols}")
        logger.info(f"Categorical columns: {categorical_cols}")
        
        # Process categorical columns with get_dummies
        categorical_features = pd.DataFrame()
        if categorical_cols:
            categorical_features = pd.get_dummies(df[categorical_cols], prefix_sep='_')
        
        # Combine all features
        numerical_features = df[numerical_cols] if numerical_cols else pd.DataFrame()
        
        # Combine all feature types
        final_df = pd.concat([
            numerical_features,
            categorical_features,
            multi_select_features
        ], axis=1)
        
        logger.info(f"Combined features shape: {final_df.shape}")
        logger.info(f"Combined feature columns: {list(final_df.columns)}")
        
        # Align with model columns (critical step!)
        final_df = final_df.reindex(columns=model_columns, fill_value=0)
        
        logger.info(f"Final aligned shape: {final_df.shape}")
        logger.info("Data preparation completed successfully")
        
        return final_df
        
    except Exception as e:
        logger.error(f"Error in data preparation: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Data preparation failed: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict_eco_friendly_purchase(survey_data: SurveyData):
    """
    Predict eco-friendly purchase behavior based on survey data
    """
    try:
        if model is None or model_columns is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        logger.info("Received prediction request")
        
        # Convert Pydantic model to dict
        data_dict = survey_data.dict()
        logger.info(f"Input data: {data_dict}")
        
        # Map the incoming data to the column names expected by the model
        # This mapping should match your training data column names
        mapped_data = {
            'Age Group': data_dict['age_group'],
            'Gender': data_dict['gender'],
            'Education Level': data_dict['education_level'],
            'Monthly Income (INR)': data_dict['monthly_income'],
            'Occupation': data_dict['occupation'],
            'Aware of fast fashion impact?': data_dict['aware_of_fast_fashion_impact'],
            'Sustainability Importance (1-5)': data_dict['sustainability_importance'],
            'What motivates you to buy eco-friendly apparel? (Select all that apply.)': data_dict['motivation_to_buy'],
            'Purchased eco-friendly before?': data_dict['purchased_eco_friendly_before'],
            'If yes, how frequently?': data_dict['frequency_of_purchase'],
            'Price Influence (1-5)': data_dict['price_influence'],
            'Brand Influence (1-5)': data_dict['brand_influence'],
            'Sustainability Influence (1-5)': data_dict['sustainability_influence'],
            'Social Influence (1-5)': data_dict['social_influence'],
            'Product Quality Influence (1-5)': data_dict['product_quality_influence'],
            'What barriers prevent you from buying sustainable fashion more often?': data_dict['primary_barrier']
        }
        
        # Prepare data for model
        prepared_df = prepare_data(mapped_data)
        
        # Make prediction
        prediction = model.predict(prepared_df)[0]
        prediction_proba = model.predict_proba(prepared_df)[0]
        
        # Get confidence score (probability of the predicted class)
        confidence_score = float(prediction_proba[prediction])
        
        # Create response
        response = PredictionResponse(
            prediction=int(prediction),
            will_buy=bool(prediction),
            confidence_score=confidence_score,
            prediction_details={
                "probability_will_not_buy": float(prediction_proba[0]),
                "probability_will_buy": float(prediction_proba[1]),
                "input_features_count": len(prepared_df.columns),
                "model_type": str(type(model).__name__)
            }
        )
        
        logger.info(f"Prediction completed: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    if model is None or model_columns is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_type": str(type(model).__name__),
        "feature_count": len(model_columns),
        "sample_features": model_columns[:10] if len(model_columns) > 10 else model_columns,
        "model_loaded": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)