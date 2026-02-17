import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-dark text-light py-3 mt-5">
      <div class="container text-center">
        <p class="mb-0">Pet Store &copy; 2026. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
