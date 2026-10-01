from marshmallow import Schema, fields, validate
from dto.base_schema import BaseSchema


class ResearchInfo(BaseSchema):
    label = fields.String(required=True)
    value = fields.String(required=True)


class ProjectCategoryRequest(BaseSchema):
    name = fields.String(required=True)
    description = fields.String(required=True)


class ProjectCategoryResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)


class ProjectInfo(BaseSchema):
    pass


class ProjectRequest(BaseSchema):
    name = fields.String(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)
    research_info = fields.List(fields.Nested(ResearchInfo), required=True)
    project_info = fields.Nested(ProjectInfo, required=True)
    slogan = fields.String(required=True)
    image = fields.String(required=True)
    category_id = fields.Integer(required=True)


class ProjectResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)
    research_info = fields.List(fields.Nested(ResearchInfo), required=True)
    project_info = fields.Nested(ProjectInfo, required=True)
    slogan = fields.String(required=True)
    image = fields.String(required=True)
    category = fields.Nested(ProjectCategoryResponse, required=True)
