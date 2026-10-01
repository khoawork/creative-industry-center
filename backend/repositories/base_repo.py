from models.PageModel import Page

def getPageById(id):
    return Page.query.filter_by(id=id).first()

def getPageBySlug(slug="home"):
    return Page.query.filter_by(slug=slug).first()