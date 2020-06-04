import { Component, OnInit,ViewChild , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Rating } from '../shared/rating';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  
   
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  err: string;
  rating: Rating;
  ratingForm: FormGroup;
  @ViewChild('rform') ratingFormDirective;


  formErrors= {
    'author':'',
    'comment': ''
  }

  validationMessages = {
    'author':{
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be least 2 character long.'
    },
    'comment':{
      'required': 'Comment is required.'
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private rt: FormBuilder) {
    this.createForm();
  }
  createForm(){
    this.ratingForm = this.rt.group ({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required]],
      rating:''
    });
    this.ratingForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any){
    if (!this.ratingForm){return;}
    const form = this.ratingForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //limpiar errores anteriores (si hay)
        this.formErrors[field] = '';
        const control = form.get(field); 
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages [key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
      

  goBack(): void{
    this.location.back();
  }
  onSubmit(){
    var a = this.rating =this.ratingForm.value;
    this.rating.date = new Date().toISOString();
    console.log(a);
    this.dish.comments.push(a);
    this.ratingForm.reset({
      author: '',
      comment: '',
      rating: ''
    });
    this.ratingFormDirective.resetForm();
    }


}
