from pyramid.view import view_config
from eventbrite import Eventbrite

def campusFilter(x):
    return x['organizer']['name']

@view_config(route_name='home', renderer='templates/list.jinja2')
# @view_config(route_name='home', renderer='json')
def home_view(request):
    eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW')
    event = eventbrite.get('/users/me/owned_events',  data={'expand':'ticket_classes,venue,organizer', 'status':'live'})
    campus = sorted(list(set(map(campusFilter, event['events']))))
    return {'events' : event['events'], 'campus' : campus, 'page' : 'home' }
# @view_config(route_name='event', renderer='json')
@view_config(route_name='event', renderer='templates/event.jinja2')
def event_view(request):
    id = request.matchdict['id']
    event = {}
    if(id):
        eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW');
        event = eventbrite.get_event(id, data={'expand':'ticket_classes,venue,organizer', 'status': 'live'})
    return {'event': event, 'page' : 'event'}

@view_config(route_name='about', renderer='templates/about.jinja2')
def about_view(request):
    return {}