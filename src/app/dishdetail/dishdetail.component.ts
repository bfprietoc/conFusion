import { Component, OnInit,ViewChild , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      visibility(),
      flyInOut(),
      expand()
    ]
})

export class DishdetailComponent implements OnInit {
  
   
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  err: string;
  comment: Comment;
  commentForm: FormGroup;
  errMess: string;
  @ViewChild('cform') commentFormDirective;
  dishcopy:Dish
  visibility = 'shown';

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
    private rt: FormBuilder,
    @Inject('BaseURL') public BaseURL) {
    this.createForm();
  }
  createForm(){
    this.commentForm = this.rt.group ({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required]],
      rating:''
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any){
    if (!this.commentForm){return;}
    const form = this.commentForm;
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
    this.route.params.pipe(switchMap((params: Params) => { this.visibility='hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
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
    var a = this.comment =this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(a);
    this.dishcopy.comments.push(a);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy= dish;
      },
      errmess => { this.dish = null; this.dishcopy= null; this.errMess = <any>errmess;})
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: ''
    });
    this.commentFormDirective.resetForm();
    }


}
