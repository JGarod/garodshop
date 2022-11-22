import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository : Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const {title,gender} = createProductDto;
      const banco = "abcdefghijklmnopqrstuvwxyz0123456789";
      let aleatoria = "";
      for (let i = 0; i < 5; i++) {
          aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
      }
      const total = gender+"-"+title.toLowerCase().split(' ').join('-')+"-"+aleatoria;
      createProductDto.slug=total;

      const product = this.ProductRepository.create(createProductDto)
      await this.ProductRepository.save(product);

      return product;
    } catch (error) {
     this.HandleDBExceptions(error)
    }


  }

  async findAll(paginationDto:PaginationDto) {
    try {

      const {limit=10,offset=0} = paginationDto
      const searchAllProducts = await this.ProductRepository.find({
        take:limit,
        skip:offset
      })
      return searchAllProducts;
    } catch (error) {
      this.HandleDBExceptions(error)
    }
  }

 async findOne(id: string) {
 
    const searchOneProduct = await this.ProductRepository.findOneBy({
      id: id,
     })
     if (!searchOneProduct) {
      throw new NotFoundException(`Product with the id not found`)
     }
     return searchOneProduct
  }
  

  async findSlug(slug: string) {
    try {
      const searchSlug = await this.ProductRepository.find({
        where: {
            slug: slug,
        },
        select:{
          title:true,
          price:true,
          description:true,
          stock:true,
          sizes:true,
          gender:true
        }
    })
    if (searchSlug.length===0) return new NotFoundException("Producto no encontrado")
      
    
    return searchSlug;
    } catch (error) {
      this.HandleDBExceptions(error)
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const updateProduct = await this.ProductRepository.preload({
      id:id,
      ...updateProductDto
    })
    const {title,gender} = updateProduct;
      const banco = "abcdefghijklmnopqrstuvwxyz0123456789";
      let aleatoria = "";
      for (let i = 0; i < 5; i++) {
          aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
      }
      const total = gender+"-"+title.toLowerCase().split(' ').join('-')+"-"+aleatoria;
      updateProduct.slug=total;

    if (!updateProduct) throw new NotFoundException("Product not found")

   try {
    return await this.ProductRepository.save(updateProduct)
   } catch (error) {
    this.HandleDBExceptions(error)
   }
  }

  async remove(id: string) {
    const deleteProduct = await this.findOne(id)

    await this.ProductRepository.remove(deleteProduct);
  }


  private HandleDBExceptions(error:any){
    if (error.code==='23505') { //estoy viendo por consola que si da ese eror es por llaves duplicadas
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected Error, check logs')
  }
}
