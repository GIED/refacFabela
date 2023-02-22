import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TotalesGeneralesTablero } from '../model/TotalesGeneralesTablero';
import { TableroService } from '../../shared/service/tablero.service';
import { VwVentaProductoAno } from '../model/VwVentraProductoAno';
import { VwVentasAnoVendedor } from '../model/VwVentasAnoVendedor';
import { TcUsuario } from '../../administracion/model/TcUsuario';
import { UsuarioService } from '../../administracion/service/usuario.service';
import { VwVentasAnoMesVendedor } from '../model/VwVentasAnoMesVendedor';

@Component({
    selector: 'app-tablero',
    templateUrl: './tablero.component.html',
    styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

    lineChartData: any;
    lineChartData2: any;

    lineChartOptions: any;

    dropdownYears: SelectItem[];
    dropdownYears2: SelectItem[];

    selectedYear: any;

    activeNews = 1;

    cars: any[];

    selectedCar: any;

    products: Product[];

    events: any[];

    selectedUsuario: any;

    //Esstos son los metodos que se tienen que quedar para la implementación definitiva
    toralesGeneralesTablero: TotalesGeneralesTablero;
    mes: string[];
    ventas: number[];
    cotizaciones: number[];
    ventaProductoAno: VwVentaProductoAno[];
    ventasAnoVendedor: VwVentasAnoVendedor[]
    usuarios: TcUsuario[];
    ventasAnoMesVendedor: VwVentasAnoMesVendedor[]
    mes2:string[];
    ventas2:number[];
    vendedor:string[];
    anoSelect:string;

    constructor(private productService: ProductService, private tableroService: TableroService, private usuarioService: UsuarioService) {
        this.toralesGeneralesTablero = {};
        this.mes = [];
        this.cotizaciones = [];
        this.ventas = [];
        this.ventasAnoVendedor = [];
        this.usuarios = [];
        this.ventasAnoMesVendedor = [];
    }
    ngOnInit() {
        const moonLanding = new Date();
        this.obtenerVentasMesAno(this.obteterAno());
        this.obtenerTotalesGenerales();
        this.obtenerVentaProductoAno(this.obteterAno());
        this.obtenerVentasAnoVendedor(this.obteterAno());
        this.usuarioService.getUsuarios().subscribe(data => {
            this.usuarios = data;
            console.log(this.usuarios);

        });
        this.obtenerVentaAnoMesVendedor(this.obteterAno(),8);
        this.dropdownYears = [
            { label: '2023', value: 2023 },
            { label: '2022', value: 2022 },
            { label: '2021', value: 2021 },
            { label: '2020', value: 2020 },
            { label: '2019', value: 2019 },
            { label: '2018', value: 2018 },
        ];
    }
    obteterAno() {
        const moonLanding = new Date();
        return moonLanding.getFullYear().toString();
    }
    consultarAno() {
        this.obtenerVentasMesAno(this.selectedYear);
        this.obtenerVentaProductoAno(this.selectedYear);
        this.obtenerVentasAnoVendedor(this.selectedYear);
        this.obtenerVentaAnoMesVendedor(this.selectedYear,8);   
        this.anoSelect=this.selectedYear;
    }
    consultarUsuario() {
        this.obtenerVentaAnoMesVendedor(this.selectedYear,this.selectedUsuario);
    }
    obtenerVentasMesAno(ano: string) {
        this.mes = [];
        this.cotizaciones = [];
        this.ventas = [];
        this.tableroService.obtenerVentasMesAno(ano).subscribe(data => {         
            for (let index = 0; index < data.length; index++) {
                this.mes.push(data[index].sMes);
                this.cotizaciones.push(data[index].nTotalCorizaciones);
                this.ventas.push(data[index].nTotalVentas);
            }
            this.lineChartData = {
                labels: this.mes,
                datasets: [
                    {
                        label: 'Cotizaciones',
                        data: this.cotizaciones,
                        borderColor: [
                            'purple'
                        ],
                        borderWidth: 3,
                        fill: false,
                        tension: .4
                    },
                    {
                        label: 'Ventas',
                        data: this.ventas,
                        borderColor: [
                            'green'
                        ],
                        borderWidth: 3,
                        fill: false,
                        tension: .4
                    }
                ]
            };
        });
    }
    obtenerGraficaVentaAnoMes() {
        this.mes2 = [];
        this.vendedor = [];
        this.ventas2 = [];  
            for (let index = 0; index < this.ventasAnoMesVendedor.length; index++) {
                this.mes2.push(this.ventasAnoMesVendedor[index].sMes);
                this.vendedor.push(this.ventasAnoMesVendedor[index].sNombreUsuario);               
                this.ventas2.push(this.ventasAnoMesVendedor[index].nTotalVentas);
            }
            this.lineChartData2 = {
                labels: this.mes2,
                datasets: [
                    {
                        label: this.vendedor[0],
                        data: this.ventas2,
                        borderColor: [
                            'purple'
                        ],
                        borderWidth: 3,
                        fill: false,
                        tension: .4
                    },                   
                ]
            };  
    }
    obtenerTotalesGenerales() {
        this.tableroService.obtenerTotalesGeneralesTablero().subscribe(data => {
        this.toralesGeneralesTablero = data;       
        })
    }
    obtenerVentaAnoMesVendedor(ano:string, id: number) {
        this.tableroService.obtenerVentasAnoMesVendedor(ano, id).subscribe(data => {
            this.ventasAnoMesVendedor = data;
            this.obtenerGraficaVentaAnoMes();
        })
    }
    obtenerVentasAnoVendedor(ano: string) {
        this.tableroService.obtenerVentasAnoVendedor(ano).subscribe(data => {
            this.ventasAnoVendedor = data;
        })
    }
    obtenerVentaProductoAno(ano: string) {
        this.ventaProductoAno = [];
        this.tableroService.obtenerVentasProductoAno(ano).subscribe(data => {
            this.ventaProductoAno = data;
        });
    }
}
