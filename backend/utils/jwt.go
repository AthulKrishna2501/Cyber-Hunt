package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateTokens(email string, fullName string) (string, string, error) {
	// Access Token
	accessTokenSecret := os.Getenv("JWT_SECRET")
	if accessTokenSecret == "" {
		accessTokenSecret = "super-secret-key-change-me"
	}

	accessTokenClaims := jwt.MapClaims{
		"email":    email,
		"fullName": fullName,
		"exp":      time.Now().Add(time.Minute * 15).Unix(),
		"iat":      time.Now().Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	at, err := accessToken.SignedString([]byte(accessTokenSecret))
	if err != nil {
		return "", "", err
	}

	// Refresh Token
	refreshTokenSecret := os.Getenv("JWT_REFRESH_SECRET")
	if refreshTokenSecret == "" {
		refreshTokenSecret = "even-more-secret-key-change-me"
	}

	refreshTokenClaims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(),
		"iat":   time.Now().Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	rt, err := refreshToken.SignedString([]byte(refreshTokenSecret))
	if err != nil {
		return "", "", err
	}

	return at, rt, nil
}

func ValidateToken(tokenString string, isRefresh bool) (jwt.MapClaims, error) {
	secretKey := os.Getenv("JWT_SECRET")
	if isRefresh {
		secretKey = os.Getenv("JWT_REFRESH_SECRET")
	}
	if secretKey == "" {
		if isRefresh {
			secretKey = "even-more-secret-key-change-me"
		} else {
			secretKey = "super-secret-key-change-me"
		}
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
