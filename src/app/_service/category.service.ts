import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { CategoryCollection } from '../_dto/categoryCollection';
import { IResponseDto } from '../_dto/responseDto';
import { CategoryDtoSingleResponse } from '../_dto/categoryDtoSingleResponse';
import { CategoryRequest } from '../_dto/categoryRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryCambio = new Subject<CategoryCollection>();
  mensajeCambio = new Subject<string>();

  private url: string = `${environment.HOST}/Category`
  constructor(
    protected http: HttpClient
  ) { }

  listar(){
    return this.http.get<CategoryCollection>(`${this.url}?page=1&rows=999999`);
  }
  listarPorId(id: number){
    return this.http.get<IResponseDto<CategoryDtoSingleResponse>>(`${this.url}/${id}`);
  }
  registrar(categoria: CategoryRequest) {
    return this.http.post(this.url, categoria);
  }
  modificar(id:number, categoria: CategoryRequest) {
    return this.http.put(`${this.url}/${id}`, categoria);
  }
  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

       //get Subjects
       getCategoryCambio() {
        return this.categoryCambio.asObservable();
      }

      getMensajeCambio() {
        return this.mensajeCambio.asObservable();
      }

      //set Subjects
      setCategoryCambio(category: CategoryCollection) {
        this.categoryCambio.next(category);
      }

      setMensajeCambio(mensaje: string) {
        this.mensajeCambio.next(mensaje);
      }
}
