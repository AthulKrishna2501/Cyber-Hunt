package models

type Report struct {
	ID             string `json:"id"`
	UserEmail      string `json:"userEmail"`
	Title          string `json:"title"`
	Description    string `json:"description"`
	Steps          string `json:"steps"`
	Severity       string `json:"severity"`
	Target         string `json:"target"`
	AttachmentPath string `json:"attachmentPath"`
	Status         string `json:"status"`
	Date           string `json:"date"`
}
