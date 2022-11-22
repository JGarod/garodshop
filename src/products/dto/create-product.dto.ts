import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number

    @IsOptional()
    @IsString()
    description?:string;

    @IsString()
    @IsOptional()
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;

    @IsString({each:true}) //es decir caa uno de los elementos que vengan en este arreglo deben ser string
    @IsArray()
    sizes:string[];

    @IsIn(['men','women','kid','unisex']) //le estoy diciendo que deben llegar estos valores o no pasa
    gender:string;

}
