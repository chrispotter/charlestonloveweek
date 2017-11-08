from pyramid.config import Configurator
from datetime import datetime

def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
    s = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S")
    return s.strftime(format)

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=0)
    config.add_static_view('include', 'include')
    config.add_route('home', '/')
    config.add_route('event', '/event/{id}')
    config.add_route('about', '/about')
    config.add_route('load_more', '/load_more/{continuation}')
    config.scan()
    config.commit()
    jinja2_env = config.get_jinja2_environment()
    jinja2_env.filters['datetimeformat'] = datetimeformat
    return config.make_wsgi_app()
