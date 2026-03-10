package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestJWTMiddleware_NoToken(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest("GET", "/api/reports", nil)
	resp, _ := app.Test(req, -1)

	// Should reject missing token with 401 Unauthorized
	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestJWTMiddleware_InvalidToken(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest("GET", "/api/reports", nil)
	req.Header.Set("Authorization", "Bearer invalid-token-string-here")
	resp, _ := app.Test(req, -1)

	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestJWTMiddleware_ValidToken(t *testing.T) {
	app := setupApp()
	token, err := generateTestToken()
	assert.NoError(t, err)

	req := httptest.NewRequest("GET", "/api/reports", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ := app.Test(req, -1)

	// Since we mock the router structure but not necessarily the underlying DB layers for
	// GetUserSubmissions, it should at least pass the middleware and hit the controller (500 or 200).
	// Let's verify it gets past the 401 Unauthorized barrier.
	assert.NotEqual(t, http.StatusUnauthorized, resp.StatusCode)
}
