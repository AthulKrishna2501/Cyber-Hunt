import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'


describe('Navbar', () => {
    it('renders the cyber hunt logo string', () => {
        render(<Navbar />)

        // Check if the logo "Cyber Hunt" exists
        const logo = screen.getByText(/Cyber Hunt/i)
        expect(logo).toBeInTheDocument()
    })

    it('shows login button when user is not authenticated', () => {
        render(<Navbar />)

        const loginBtn = screen.getByRole('link', { name: /Login/i })
        expect(loginBtn).toBeInTheDocument()
    })
})
