import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <Link 
          to="/privacy" 
          className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
}
