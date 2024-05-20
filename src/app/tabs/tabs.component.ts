import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';

export type Item<T> = {
  data: T;
  id: string
  contentRef?: TemplateRef<{
    item: T;
  }>;
} & ({
  headerRef?: TemplateRef<{
    item: T;
  }>;
} | {
  label: string;
})

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TabsComponent<T = any> {
  private items$ = new Subject<Item<T>[]>();
  private model$ = new Subject<string>();
  protected signalItems = toSignal(this.items$, {
    initialValue: [],
  });
  protected signalModel = toSignal(this.model$, {
    initialValue: '',
  });

  @Input() set model(value: string) {
    this.model$.next(value);
  }

  @Input() set items(items: Item<T>[]) {
    this.items$.next(items);
  }

  @Output()
  modelChange = new EventEmitter<string>();

  @Output()
  removeItem = new EventEmitter<string>();

  @Output()
  changeItems = new EventEmitter<T[]>();

  selectedTab = computed(() => this.signalItems().find(item => item.id === this.signalModel()));
  removeTab(id: string, index: number) {
    const data = this.signalItems().filter((_, jndex) => jndex !== index);
    this.items$.next(data);
    this.removeItem.emit(id);
    this.changeItems.emit(data.map(item => item.data));
  }

}
