import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <p>Pet Store &copy; 2026. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    footer { border-top: 1px solid var(--p-content-border-color); color: var(--p-text-muted-color); padding: 1.25rem; text-align: center; }
    p { margin: 0; }
  `]
})
export class FooterComponent {}
