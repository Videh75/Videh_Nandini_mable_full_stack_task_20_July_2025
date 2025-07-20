package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/models"
)

type DummyJSONResponse struct {
	Products []models.Product `json:"products"`
}

func GetProducts(c *gin.Context) {
	resp, err := http.Get("https://dummyjson.com/products")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products from external API"})
		return
	}
	defer resp.Body.Close()

	var result DummyJSONResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode product list"})
		return
	}

	c.JSON(http.StatusOK, result.Products)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	url := "https://dummyjson.com/products/" + id

	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	defer resp.Body.Close()

	var product models.Product
	if err := json.NewDecoder(resp.Body).Decode(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode product"})
		return
	}

	c.JSON(http.StatusOK, product)
}
