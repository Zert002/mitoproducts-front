import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductDto } from 'src/app/_dto/productDto';
import { ProductService } from 'src/app/_service/product.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  displayedColumns = ['productId', 'productName','category', 'unitPrice', 'acciones'];
  dataSource!: MatTableDataSource<ProductDto>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private productService : ProductService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productService.productCambio.subscribe(data => {
      this.crearTabla(data.collection);
    });

    this.productService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.productService.listar().subscribe(data => {
      this.crearTabla(data.collection);
    });
  }
  filtrar(valor:string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  crearTabla(data: ProductDto[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.productService.eliminar(id).pipe(switchMap(() => {
      return this.productService.listar();
    })).subscribe(data => {
      this.productService.productCambio.next(data);
      this.productService.mensajeCambio.next('SE ELIMINO');
    });
  }
}
