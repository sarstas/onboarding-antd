import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from "@angular/common";
import { MonthYearControlComponent } from "../month-year-control/month-year-control.component";
import { timer, Subject, takeUntil, tap, interval  } from 'rxjs';
import { ThousandSeparatorPipe } from '../../pipes/thousandSeparator.pipe';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzDividerComponent } from 'ng-zorro-antd/divider';


@Component({
  selector: 'app-product-collection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    JsonPipe,
    NgIf,
    MonthYearControlComponent,
    NzFormDirective,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzColDirective,
    NzFormItemComponent,
    NzInputDirective,
    NzButtonComponent,
    NzIconDirective,
    NzDividerComponent,
    NzInputGroupComponent
  ],
  templateUrl: './product-collection.component.html',
  styleUrl: './product-collection.component.scss'
})
export class ProductCollectionComponent implements OnDestroy {
  public productForm: FormGroup;
  public submitted = false;
  public isSubmitDisabled = false;
  public remainingTime: number = 0;

  private _thousandSeparatorPipe = new ThousandSeparatorPipe();
  private destroy$ = new Subject<void>();


  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      products: this.fb.array([])
    });

    // Добавление одного начального продукта
    this.addProduct();
  }

  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  public addProduct() {
    const productGroup = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', ], //будет содержать общее количество месяцев
    });

    this.products.push(productGroup);
  }

  public removeProduct(index: number) {
    this.products.removeAt(index);
  }

  public getFormattedPrice(index: number): string {
    const priceControl = this.products.at(index).get('price');
    return this._thousandSeparatorPipe.transform(priceControl?.value || '');
  }

  public onPriceInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/,/g, '');
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      this.products.at(index).get('price')?.setValue(numericValue);
    } else {
      this.products.at(index).get('price')?.setValue('');
    }

    // Обновляем отображаемое значение
    input.value = this.getFormattedPrice(index);
  }

  public onSubmit() {
    this.submitted = true;
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      // Здесь можно обработать данные формы, например, отправить их на сервер

      // Блокируем кнопку на 60 секунд
      this._disableSubmitButton();
    }
  }

  private _disableSubmitButton() {
    this.isSubmitDisabled = true;
    this.remainingTime = 60;

    timer(60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSubmitDisabled = false;
        this.remainingTime = 0;
      });

    interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(timer(60000)),
        tap(() => this.remainingTime--)
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
