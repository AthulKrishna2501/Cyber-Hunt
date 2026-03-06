package services

import (
	"context"
	"fmt"
	"os"

	"cyberhunt-backend/models"

	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

var SheetsService *sheets.Service
var SheetID string

func InitSheets() error {
	ctx := context.Background()
	SheetID = os.Getenv("GOOGLE_SHEET_ID")
	credentialsPath := os.Getenv("GOOGLE_CREDENTIALS_PATH")

	srv, err := sheets.NewService(ctx, option.WithCredentialsFile(credentialsPath))
	if err != nil {
		return fmt.Errorf("unable to retrieve Sheets client: %v", err)
	}

	SheetsService = srv

	// Ensure the "Users" sheet has headers and formatting
	if err := EnsureUsersSheet(); err != nil {
		fmt.Printf("Warning: Could not initialize Users sheet headers: %v\n", err)
	}

	// Ensure the "Reports" sheet has headers and formatting
	if err := EnsureReportsSheet(); err != nil {
		fmt.Printf("Warning: Could not initialize Reports sheet headers: %v\n", err)
	}

	return nil
}

func formatHeader(sheetTitle string, columnCount int) error {
	spreadsheet, err := SheetsService.Spreadsheets.Get(SheetID).Do()
	if err != nil {
		return err
	}

	var sheetID int64
	for _, s := range spreadsheet.Sheets {
		if s.Properties.Title == sheetTitle {
			sheetID = s.Properties.SheetId
			break
		}
	}

	req := &sheets.BatchUpdateSpreadsheetRequest{
		Requests: []*sheets.Request{
			{
				RepeatCell: &sheets.RepeatCellRequest{
					Range: &sheets.GridRange{
						SheetId:          sheetID,
						StartRowIndex:    0,
						EndRowIndex:      1,
						StartColumnIndex: 0,
						EndColumnIndex:   int64(columnCount),
					},
					Cell: &sheets.CellData{
						UserEnteredFormat: &sheets.CellFormat{
							BackgroundColor: &sheets.Color{
								Red:   0.05,
								Green: 0.33,
								Blue:  0.24,
							},
							TextFormat: &sheets.TextFormat{
								ForegroundColor: &sheets.Color{Red: 1, Green: 1, Blue: 1},
								Bold:            true,
								FontSize:        11,
							},
							HorizontalAlignment: "CENTER",
						},
					},
					Fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
				},
			},
		},
	}
	_, err = SheetsService.Spreadsheets.BatchUpdate(SheetID, req).Do()
	return err
}

func EnsureUsersSheet() error {
	// Define headers exactly as in the requested screenshot
	headers := []interface{}{"FullName", "Email", "Phone", "Batch", "Module", "Consent"}
	rb := &sheets.ValueRange{Values: [][]interface{}{headers}}

	// Update headers to ensure naming is correct (FullName vs Full Name)
	_, err := SheetsService.Spreadsheets.Values.Update(SheetID, "Users!A1:F1", rb).ValueInputOption("USER_ENTERED").Do()
	if err != nil {
		return err
	}

	// Format the first 5 columns (FullName to Module) with the dark green theme
	return formatHeader("Users", 5)
}

func EnsureReportsSheet() error {
	spreadsheet, err := SheetsService.Spreadsheets.Get(SheetID).Do()
	if err != nil {
		return fmt.Errorf("unable to retrieve spreadsheet: %v", err)
	}

	exists := false
	for _, s := range spreadsheet.Sheets {
		if s.Properties.Title == "Reports" {
			exists = true
			break
		}
	}

	if !exists {
		req := &sheets.BatchUpdateSpreadsheetRequest{
			Requests: []*sheets.Request{
				{
					AddSheet: &sheets.AddSheetRequest{
						Properties: &sheets.SheetProperties{
							Title: "Reports",
						},
					},
				},
			},
		}
		_, err := SheetsService.Spreadsheets.BatchUpdate(SheetID, req).Do()
		if err != nil {
			return fmt.Errorf("unable to create Reports sheet: %v", err)
		}
	}

	resp, err := SheetsService.Spreadsheets.Values.Get(SheetID, "Reports!A1:J1").Do()
	if err == nil && len(resp.Values) > 0 {
		return formatHeader("Reports", 10)
	}

	headers := []interface{}{"ID", "User Email", "Title", "Description", "Steps", "Severity", "Target", "Attachment Path", "Status", "Date"}
	rb := &sheets.ValueRange{Values: [][]interface{}{headers}}
	_, err = SheetsService.Spreadsheets.Values.Update(SheetID, "Reports!A1:J1", rb).ValueInputOption("USER_ENTERED").Do()
	if err != nil {
		return err
	}
	return formatHeader("Reports", 10)
}

func AppendUser(values []interface{}) error {
	rb := &sheets.ValueRange{
		Values: [][]interface{}{values},
	}
	_, err := SheetsService.Spreadsheets.Values.Append(SheetID, "Users!A:F", rb).ValueInputOption("USER_ENTERED").Do()
	return err
}

func GetUsers() ([][]interface{}, error) {
	resp, err := SheetsService.Spreadsheets.Values.Get(SheetID, "Users!A:F").Do()
	if err != nil {
		return nil, err
	}
	return resp.Values, nil
}

func AppendReport(report models.Report) error {
	values := []interface{}{
		report.ID,
		report.UserEmail,
		report.Title,
		report.Description,
		report.Steps,
		report.Severity,
		report.Target,
		report.AttachmentPath,
		report.Status,
		report.Date,
	}
	rb := &sheets.ValueRange{
		Values: [][]interface{}{values},
	}
	_, err := SheetsService.Spreadsheets.Values.Append(SheetID, "Reports!A:J", rb).ValueInputOption("USER_ENTERED").Do()
	return err
}

func GetReports() ([][]interface{}, error) {
	resp, err := SheetsService.Spreadsheets.Values.Get(SheetID, "Reports!A:J").Do()
	if err != nil {
		return nil, err
	}
	return resp.Values, nil
}
