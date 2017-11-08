from pyramid.view import view_config
from pyramid.renderers import render
from eventbrite import Eventbrite

def campusFilter(x):
    return x['organizer']['name']

@view_config(route_name='home', renderer='templates/list.jinja2')
# @view_config(route_name='home', renderer='json')
def home_view(request):
    eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW')
    event = eventbrite.get('/users/me/owned_events',  data={'expand':'ticket_classes,venue,organizer', 'status':'live'})
    campus = sorted(list(set(map(campusFilter, event['events']))))
    # campus = []
    return {'events' : event['events'], 'pagination': event['pagination'], 'campus' : campus, 'page' : 'home' }
# @view_config(route_name='event', renderer='json')
@view_config(route_name='event', renderer='templates/event.jinja2')
def event_view(request):
    id = request.matchdict['id']
    event = {}
    if(id):
        eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW');
        event = eventbrite.get("/events/{0}/".format(id), data={'expand':'ticket_classes,venue,organizer', 'status':'live'})
    return {'event': event, 'page' : 'event'}

@view_config(route_name='about', renderer='templates/about.jinja2')
def about_view(request):
    return {}

# @view_config(route_name='load_more', renderer='templates/partials/ajax_list.jinja2')
@view_config(route_name='load_more', renderer='json')
def load_more_view(request):
    continuation = request.matchdict['continuation']
    event = {}
    if(continuation):
        eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW');
        event = eventbrite.get('/users/me/owned_events',  data={
            'expand':'ticket_classes,venue,organizer', 
            'continuation':continuation,
            'status':'live'
        })
        body_dict = {
            'events': event['events'], 
            'pagination': event['pagination']
        }
        select_dict={
            'campus': sorted(list(set(map(campusFilter, event['events']))))
        }
        
        return {
            'success' : True,
            'body': render('templates/partials/ajax_list.jinja2', body_dict, request),
            'select': render('templates/partials/ajax_select_options.jinja2', select_dict, request)
        }