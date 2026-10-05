import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ApiAdminService} from '../../services/api/api-admin.service';
import {AdminUser} from '../../models/admin-user';
import {RoleRead} from '../../models/role-read';
import {extractErrorMessage} from '../../services/api/error.util';
import {Page} from '../../models/page';

@Component({
  selector: 'app-admin-panel',
  imports: [DatePipe],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

  private apiAdminService = inject(ApiAdminService);
  private cdr = inject(ChangeDetectorRef);

  users: AdminUser[] = [];
  roles: RoleRead[] = [];

  roleSelection: {[userId: number] : number} = {};
  errorMessage = '';

  currentPage = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  private loadRoles() {
    this.apiAdminService.getRoles$().subscribe({
      next: roles => { this.roles = roles; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  private loadUsers() {
    this.apiAdminService.getUsers$(this.currentPage).subscribe({
      next: (page: Page<AdminUser>) => {
        this.users = page.content;
        this.currentPage = page.number;
        this.totalPages = page.totalPages;
        page.content.forEach(u => this.roleSelection[u.id] = u.roleId);
        this.cdr.detectChanges();
      },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  goToPage(page: number) {
    if (page < 0 || (this.totalPages && page >= this.totalPages)) return;
    this.currentPage = page;
    this.loadUsers();
  }

  onRoleChange(userId: number, event: Event) {
    this.roleSelection[userId] = Number((event.target as HTMLSelectElement).value);
  }

  toggleBan(user: AdminUser) {
    const call = user.isActive
      ? this.apiAdminService.banUser$(user.id)
      : this.apiAdminService.unbanUser$(user.id);
    call.subscribe({
      next: () => this.loadUsers(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  applyRole(userId: number) {
    const roleId = this.roleSelection[userId];
    if (!roleId) return;
    this.apiAdminService.setRole$(userId, roleId).subscribe({
      next: () => this.loadUsers(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

}
