import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaEdicionComponent } from './pages/categoria/categoria-edicion/categoria-edicion.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './pages/producto/producto.component';

const routes: Routes = [{
  path: 'category', component: CategoriaComponent, children: [
    { path: 'new', component: CategoriaEdicionComponent},
    { path: 'edit/:id', component: CategoriaEdicionComponent}
  ]
},
{
  path: 'product', component: ProductoComponent, children: [
    { path: 'new', component: ProductoEdicionComponent},
    { path: 'edit/:id', component: ProductoEdicionComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
