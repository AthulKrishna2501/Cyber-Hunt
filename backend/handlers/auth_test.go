package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	app := setupApp()

	// Verify the /api/ping route
	req := httptest.NewRequest("GET", "/api/ping", nil)
	resp, err := app.Test(req, -1) // -1 disables timeout

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	assert.Equal(t, "pong", buf.String())
}

func TestLoginValidation(t *testing.T) {
	app := setupApp()

	// Test case: Missing email
	payload := map[string]string{
		"password": "some_password", // Irrelevant, just to be something valid JSON
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/api/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req, -1)

	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)

	// Since we haven't mocked the database/sheets layer completely, a valid payload
	// might fail due to "Invalid Credentials" (Auth failure), which is expected behavior without fixtures.
	payload = map[string]string{
		"email": "invalid@test.com",
	}
	body, _ = json.Marshal(payload)

	req = httptest.NewRequest("POST", "/api/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = app.Test(req, -1)

	assert.Equal(t, http.StatusUnauthorized, resp.StatusCode)
}

func TestRegisterValidation(t *testing.T) {
	app := setupApp()

	// Edge case: empty json
	req := httptest.NewRequest("POST", "/api/register", bytes.NewReader([]byte("{}")))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req, -1)

	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}
