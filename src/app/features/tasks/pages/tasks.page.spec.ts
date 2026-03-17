import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TasksPage } from './tasks.page';
import { TaskStatus } from '../models/task.model';

describe('TasksPage', () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    component.toggleDropdown('1');
    expect(component.openDropdownId()).toBe('1');
    component.toggleDropdown('1');
    expect(component.openDropdownId()).toBeNull();
  });

  it('should have TaskStatus available', () => {
    expect(component.taskStatus).toBe(TaskStatus);
  });

  it('should have default stats', () => {
    const stats = component.stats();
    expect(stats.total).toBe(0);
  });
});
