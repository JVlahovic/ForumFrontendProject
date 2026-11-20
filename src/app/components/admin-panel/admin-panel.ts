import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ApiAdminService} from '../../services/api/api-admin.service';
import {AdminUser} from '../../models/admin-user';
import {RoleRead} from '../../models/role-read';
import {ThreadCategory} from '../../models/thread-category';
import {Page} from '../../models/page';
import {extractErrorMessage} from '../../services/api/error.util';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

  private apiAdminService = inject(ApiAdminService);
  private cdr = inject(ChangeDetectorRef);

  users: AdminUser[] = [];
  roles: RoleRead[] = [];
  categories: ThreadCategory[] = [];

  roleSelection: {[userId: number]: number} = {};
  errorMessage = '';

  currentPage = 0;
  totalPages = 0;

  // user search
  userFilterName = '';
  userFilterRoleId: number | null = null;

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
    this.loadCategories();
  }

  private loadRoles() {
    this.errorMessage = '';
    this.apiAdminService.getRoles$().subscribe({
      next: roles => { this.roles = roles; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  private loadUsers() {
    this.errorMessage = '';
    this.apiAdminService.getUsers$(this.currentPage, this.userFilterName, this.userFilterRoleId ?? undefined).subscribe({
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

  applyUserFilter() {
    this.currentPage = 0;
    this.loadUsers();
  }

  onUserRoleFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.userFilterRoleId = value ? Number(value) : null;
  }

  clearUserFilter() {
    this.userFilterName = '';
    this.userFilterRoleId = null;
    this.currentPage = 0;
    this.loadUsers();
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
    this.errorMessage = '';
    const call = user.isActive
      ? this.apiAdminService.banUser$(user.id)
      : this.apiAdminService.unbanUser$(user.id);
    call.subscribe({
      next: () => this.loadUsers(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  applyRole(userId: number) {
    this.errorMessage = '';
    const roleId = this.roleSelection[userId];
    if (!roleId) return;
    this.apiAdminService.setRole$(userId, roleId).subscribe({
      next: () => this.loadUsers(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  private loadCategories() {
    this.errorMessage = '';
    this.apiAdminService.getCategories$().subscribe({
      next: cats => { this.categories = cats; this.cdr.detectChanges(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  createCategory(form: NgForm) {
    this.errorMessage = '';
    if (form.invalid) return;
    this.apiAdminService.createCategory$(form.value).subscribe({
      next: () => { form.resetForm(); this.loadCategories(); },
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

  deleteCategory(id: number) {
    this.errorMessage = '';
    if (!confirm('Delete this category?')) return;
    this.apiAdminService.deleteCategory$(id).subscribe({
      next: () => this.loadCategories(),
      error: err => { this.errorMessage = extractErrorMessage(err); this.cdr.detectChanges(); }
    });
  }

}
