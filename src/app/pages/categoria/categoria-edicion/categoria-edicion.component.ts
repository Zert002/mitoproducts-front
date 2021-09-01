import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CategoryRequest } from 'src/app/_dto/categoryRequest';
import { CategoryService } from 'src/app/_service/category.service';

@Component({
  selector: 'app-categoria-edicion',
  templateUrl: './categoria-edicion.component.html',
  styleUrls: ['./categoria-edicion.component.css']
})
export class CategoriaEdicionComponent implements OnInit {
  id: number = 0;
  categoryRequest!: CategoryRequest;
  form!: FormGroup;
  edicion: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id' : new FormControl(0),
      'name': new FormControl(''),
      'description': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    })
  }
  initForm(){
    if(this.edicion){
      this.categoryService.listarPorId(this.id).subscribe(data => {
        let id = data.result.categoryId;
        let name = data.result.categoryName;
        let description = data.result.categoryDescription;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'name': new FormControl(name),
          'description': new FormControl(description)

        });
      })
    }
  }

  operar(){

    this.categoryRequest = new CategoryRequest();
    this.categoryRequest.name = this.form.value['name'];
    this.categoryRequest.description = this.form.value['description'];

    if(this.categoryRequest != null && this.id > 0){
      console.log(this.id);
      console.log(this.categoryRequest);

      this.categoryService.modificar(this.id,this.categoryRequest).pipe(switchMap(()=>{
        return this.categoryService.listar();
      })).subscribe(data => {
        this.categoryService.setCategoryCambio(data);
        this.categoryService.setMensajeCambio('Categoria modificada');
      });
    }
    else {
      this.categoryService.registrar(this.categoryRequest).pipe(switchMap(()=>{
        return this.categoryService.listar();
      })).subscribe(data => {
        this.categoryService.setCategoryCambio(data);
        this.categoryService.setMensajeCambio('Categoria Registrada')
      });
    }
    this.router.navigate(['/category']);
  }
}
