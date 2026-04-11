import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
