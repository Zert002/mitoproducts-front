import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCollection } from '../_dto/productCollection';
import { ProductDtoSingleResponse } from '../_dto/productDtoSingleResponse';
import { ProductRequest } from '../_dto/productRequest';
import { IResponseDto } from '../_dto/responseDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productCambio = new Subject<ProductCollection>();
  mensajeCambio = new Subject<string>();

  private url: string = `${environment.HOST}/Product`

  constructor(
    protected http: HttpClient
  ) { }

  listar(){
    return this.http.get<ProductCollection>(`${this.url}?page=1&rows=999999`);
  }
  listarPorId(id: number){
    return this.http.get<IResponseDto<ProductDtoSingleResponse>>(`${this.url}/${id}`);
  }
  registrar(categoria: ProductRequest) {
    return this.http.post(this.url, categoria);
  }
  modificar(id:number, categoria: ProductRequest) {
    return this.http.put(`${this.url}/${id}`, categoria);
  }
  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

       //get Subjects
       getCategoryCambio() {
        return this.productCambio.asObservable();
      }

      getMensajeCambio() {
        return this.mensajeCambio.asObservable();
      }

      //set Subjects
      setProductCambio(category: ProductCollection) {
        this.productCambio.next(category);
      }

      setMensajeCambio(mensaje: string) {
        this.mensajeCambio.next(mensaje);
      }
}
