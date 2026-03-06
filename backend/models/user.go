package models

type User struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Batch    string `json:"batch"`
	Module   string `json:"module"`
	Consent  bool   `json:"consent"`
}

type LoginRequest struct {
	Email string `json:"email"`
}
