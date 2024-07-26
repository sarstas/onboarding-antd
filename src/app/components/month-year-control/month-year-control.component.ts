import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputDirective } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-month-year-control',
  standalone: true,
  templateUrl: './month-year-control.component.html',
  styleUrls: ['./month-year-control.component.scss', ],
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    NzColDirective,
    NzFormControlComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthYearControlComponent),
      multi: true
    }
  ]
})
export class MonthYearControlComponent implements ControlValueAccessor, OnInit {
  @Input() totalMonths: number = 0;

  public totalMonthsControl: FormControl<number> = new FormControl();

  get totalMonthsControlValue(): number {
    return this.totalMonthsControl.getRawValue();
  }

  constructor() {
  }

  ngOnInit() {
    this.totalMonthsControl?.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    })
  }

  public writeValue(totalMonths: number): void {
    this.totalMonthsControl?.setValue(totalMonths, {emitEvent: false});
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
  }

  private onChange = (value: number): void=> {
  };
  private onTouched = (): void => {
  };
}
