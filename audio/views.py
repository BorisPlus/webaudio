import datetime

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'audio/index.html', {})


def example001(request):
    return render(request, 'audio/example001.html', {})


def example002(request):
    return render(request, 'audio/example002.html', {})


@csrf_exempt
def save(request):
    if request.method != 'POST':
        return HttpResponse(status=500)
    with open(f'./files/{datetime.datetime.utcnow()}.mp3', 'wb') as f:
        for chunk in request.FILES['file'].chunks():
            f.write(chunk)
    return HttpResponse(status=204)
