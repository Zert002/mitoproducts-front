import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryDtoSingleResponse } from 'src/app/_dto/categoryDtoSingleResponse';
import { CategoryService } from 'src/app/_service/category.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  displayedColumns = ['categoryId', 'categoryName', 'categoryDescription', 'acciones'];
  dataSource!: MatTableDataSource<CategoryDtoSingleResponse>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private categoryService : CategoryService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryService.categoryCambio.subscribe(data => {
      this.crearTabla(data.collection);
    });

    this.categoryService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.categoryService.listar().subscribe(data => {
      this.crearTabla(data.collection);
    });
  }

  filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: CategoryDtoSingleResponse[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.categoryService.eliminar(id).pipe(switchMap(() => {
      return this.categoryService.listar();
    })).subscribe(data => {
      this.categoryService.categoryCambio.next(data);
      this.categoryService.mensajeCambio.next('SE ELIMINO');
    });
  }
}
