import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CategoryDtoSingleResponse } from 'src/app/_dto/categoryDtoSingleResponse';
import { ProductRequest } from 'src/app/_dto/productRequest';
import { CategoryService } from 'src/app/_service/category.service';
import { ProductService } from 'src/app/_service/product.service';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {
  id: number = 0;
  productRequest!: ProductRequest;
  form!: FormGroup;
  edicion: boolean = false;
  listCategories!: CategoryDtoSingleResponse[];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'productName': new FormControl(''),
      'categoryId': new FormControl(0),
      'productPrice': new FormControl(0),
      'productEnabled' : new FormControl(false)
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    })
  }
  initForm(){
    this.categoryService.listar().subscribe(data =>{
      this.listCategories = data.collection;
    })
    if(this.edicion){
      this.productService.listarPorId(this.id).subscribe(data => {
        let id = data.result.productId;
        let name = data.result.productName;
        let categoryId = data.result.categoryId;
        let price = data.result.productPrice;
        let enabled = data.result.productEnabled;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'productName': new FormControl(name),
          'categoryId': new FormControl(categoryId),
          'productPrice': new FormControl(price),
          'productEnabled': new FormControl(enabled)
        });
      })
    }
  }
  operar(){

    this.productRequest = new ProductRequest();
    this.productRequest.productName = this.form.value['productName'];
    this.productRequest.categoryId = this.form.value['categoryId'];
    this.productRequest.productPrice = this.form.value['productPrice'];
    this.productRequest.productEnabled = this.form.value['productEnabled'];

    if(this.productRequest != null && this.id > 0){

      this.productService.modificar(this.id,this.productRequest).pipe(switchMap(()=>{
        return this.productService.listar();
      })).subscribe(data => {
        this.productService.setProductCambio(data);
        this.productService.setMensajeCambio('Producto modificado');
      });
    }
    else {
      this.productService.registrar(this.productRequest).pipe(switchMap(()=>{
        return this.productService.listar();
      })).subscribe(data => {
        this.productService.setProductCambio(data);
        this.productService.setMensajeCambio('Producto Registrado')
      });
    }
    this.router.navigate(['/product']);
  }
}
