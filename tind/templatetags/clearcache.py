from django import template
from django.template import resolve_variable
from django.core.cache import cache
from django.utils.http import urlquote
from django.utils.hashcompat import md5_constructor

register = template.Library()

class ClearCacheNode(template.Node):
    def __init__(self, fragment_name, vary_on):
        self.fragment_name = fragment_name
        self.vary_on = vary_on

    def render(self, context):
        # Build a unicode key for this fragment and all vary-on's.
        args = md5_constructor(u':'.join([urlquote(resolve_variable(var, context)) for var in self.vary_on]))
        cache_key = 'template.cache.%s.%s' % (self.fragment_name, args.hexdigest())
        cache.delete(cache_key)
        return ''

def clearcache(parser, token):
    """
    This will clear the cache for a template fragment

    Usage::

        {% load clearcache %}
        {% clearcache [fragment_name] %}

    This tag also supports varying by a list of arguments::

        {% load clearcache %}
        {% clearcache [fragment_name] [var1] [var2] .. %}

    The set of arguments must be the same as the original cache tag (except for expire_time).
    """
    try:
        tokens = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires at least one argument" % token.contents.split()[0]
    return ClearCacheNode(tokens[1], tokens[2:])

register.tag('clearcache', clearcache)