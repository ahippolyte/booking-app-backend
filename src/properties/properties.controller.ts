import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({ status: 200, description: 'Return all properties' })
  findAll(@Query() filters: PropertyFilterDto) {
    return this.propertiesService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiResponse({ status: 200, description: 'Return featured properties' })
  getFeatured() {
    return this.propertiesService.getFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({ status: 200, description: 'Return the property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get property by slug' })
  @ApiResponse({ status: 200, description: 'Return the property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.propertiesService.findBySlug(slug);
  }

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property (Admin only)' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property (Admin only)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
