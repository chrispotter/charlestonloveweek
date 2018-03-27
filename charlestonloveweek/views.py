from pyramid.view import view_config
from pyramid.renderers import render
from eventbrite import Eventbrite

def campusFilter(x):
    return x['organizer']['name']

@view_config(route_name='home', renderer='templates/donate.jinja2')
# @view_config(route_name='home', renderer='json')
def home_view(request):
    return { 'page' : 'donate' }

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
@view_config(route_name='load_list', renderer='json')
def load_list_view(request):
    eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW');
    event = eventbrite.get('/users/me/owned_events',  data={'expand':'ticket_classes,venue,organizer', 'status':'live'})

    while(event['pagination']['has_more_items']):
        newEvent = eventbrite.get('/users/me/owned_events',  data={
            'expand':'ticket_classes,venue,organizer', 
            'continuation':event['pagination']['continuation']
        })
        event['events'] = event['events'] + newEvent['events']
        event['pagination'].update(newEvent['pagination'])
    
    campus = sorted(list(set(map(campusFilter, event['events']))))
    body_dict = {
        'events': event['events'], 
        'campus': sorted(list(set(map(campusFilter, event['events'])))),
    }
    
    return {
        'success' : True,
        'body': render('templates/list.jinja2', body_dict, request),
    }

@view_config(route_name='list', renderer='json')
def list_view(request):
    eventbrite = Eventbrite('LMFOOHNOMAVQGLDMUPIW');
    event = eventbrite.get('/users/me/owned_events',  data={'expand':'ticket_classes,venue,organizer', 'status':'live'})

    while(event['pagination']['has_more_items']):
        newEvent = eventbrite.get('/users/me/owned_events',  data={
            'expand':'ticket_classes,venue,organizer', 
            'continuation':event['pagination']['continuation']
        })
        event['events'] = event['events'] + newEvent['events']
        event['pagination'].update(newEvent['pagination'])
    
    campus = sorted(list(set(map(campusFilter, event['events']))))
    body_dict = {
        'events': event['events'], 
        'campus': sorted(list(set(map(campusFilter, event['events'])))),
    }
    
    return body_dict



@view_config(route_name='donate', renderer='templates/donate.jinja2')
def donate_view(request):
    return {}

