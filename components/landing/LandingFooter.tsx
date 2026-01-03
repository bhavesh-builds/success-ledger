export function LandingFooter() {
  // Use static year to avoid hydration mismatches
  const currentYear = 2024

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-bold">Success Ledger</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your personal achievement platform
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            © {currentYear} Success Ledger. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

