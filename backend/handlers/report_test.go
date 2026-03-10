package handlers_test

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReportSubmission_MissingEmail(t *testing.T) {
	app := setupApp()
	token, _ := generateTestToken()

	req := httptest.NewRequest("POST", "/api/reports", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	// Missing userEmail in formdata should fail

	resp, _ := app.Test(req, -1)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestReportSubmission_SuccessWithProofUrl(t *testing.T) {
	app := setupApp()
	token, _ := generateTestToken()

	// Create multipart form body
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("userEmail", "test@example.com")
	writer.WriteField("title", "Found a bug")
	writer.WriteField("description", "Bug description")
	writer.WriteField("steps", "1. Open site\n2. Click button")
	writer.WriteField("severity", "High")
	writer.WriteField("proofUrl", "https://example.com/proof.png")
	writer.Close()

	req := httptest.NewRequest("POST", "/api/reports", body)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, _ := app.Test(req, -1)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestGetReports_Success(t *testing.T) {
	app := setupApp()
	token, _ := generateTestToken()

	req := httptest.NewRequest("GET", "/api/reports?email=john@test.com", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req, -1)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestGetReports_MissingEmailParam(t *testing.T) {
	app := setupApp()
	token, _ := generateTestToken()

	req := httptest.NewRequest("GET", "/api/reports", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req, -1)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestFormatSteps(t *testing.T) {
	// Let's test the helper indirectly through a request, or if it was exported, directly.
	// Since formatSteps is internal to the handler package, we can test it directly
	// because we are in handlers_test, BUT wait - formatSteps is an unexported func in handlers.
	// A better way is to test the actual submission payload format.
	app := setupApp()
	token, _ := generateTestToken()

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("userEmail", "test@example.com")
	writer.WriteField("steps", "- Click here\n* Click there")
	writer.WriteField("proofUrl", "https://example.com/proof.png")
	writer.Close()

	req := httptest.NewRequest("POST", "/api/reports", body)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, _ := app.Test(req, -1)

	// Should succeed and format steps in the response body.
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respString := buf.String()

	assert.True(t, strings.Contains(respString, "1. Click here"))
	assert.True(t, strings.Contains(respString, "2. Click there"))
}
