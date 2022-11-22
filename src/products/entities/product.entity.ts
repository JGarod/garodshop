import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid') //le digo que sea uuid
    id:string;

    @Column('text',{  //le digo que es una columna de text y que sea unica
        // unique: true,
    })
    title:string;

    @Column('float',{  //el precio sera umerico y por defecto sera 0
        default: 0
    })
    price:number

    @Column({ //descripcion tipo texto y que puede ser nulo
        type:'text',
        nullable:true
    })
    description:string;

    @Column({ //sera el link de busqueda ,por eso es unico
        unique:true
    })
    slug:string;

    @Column({ //lo mismo que el precio
        default: 0
    })
    stock:number;

    @Column('text',{ //un array con los tamaños
        array:true
    })
    sizes:string[];

    @Column('text')
    gender:string;
    
}
