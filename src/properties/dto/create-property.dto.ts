import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PropertyType {
  RIAD = 'RIAD',
  VILLA = 'VILLA',
  APARTMENT = 'APARTMENT',
}

export class CreatePropertyImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  alt: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pricePerNight: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  cleaningFee?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  weeklyDiscount?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  guests: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  bedrooms: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  bathrooms: number;

  @ApiPropertyOptional({ type: [CreatePropertyImageDto] })
  @IsArray()
  @IsOptional()
  images?: CreatePropertyImageDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  amenityIds?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
