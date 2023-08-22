from django.http import HttpResponseRedirect, JsonResponse
from bson import ObjectId
from django.shortcuts import render
from .models import Note


def task_list(request):
    tasks = Note.objects.all()
    tasks_with_id = [
        {
            "id": str(tasks[task_number]._id),
            "title": tasks[task_number].title,
            "completed": tasks[task_number].completed,
            "created_at": tasks[task_number].created_at,
        }
        for task_number in range(len(tasks))
    ]
    return render(request, "todolist_list.html", {"tasks": tasks_with_id})


def add(request):
    title_from_request = request.POST["title"]
    new_item = Note(title=title_from_request)
    new_item.save()
    return HttpResponseRedirect("/")


def delete(request, i):
    task_id_from_request = ObjectId(i)
    task = Note.objects.get(_id=task_id_from_request)
    task.delete()
    return HttpResponseRedirect("/")


def change_status(request, i):
    task_id_from_request = ObjectId(i)
    task = Note.objects.get(_id=task_id_from_request)

    task.completed = request.POST.get("completed") == "true"
    task.save()

    return HttpResponseRedirect("/")


def edit_title(request, i):
    task_id_from_request = ObjectId(i)
    task = Note.objects.get(_id=task_id_from_request)

    new_title = request.POST.get("title")
    task.title = new_title
    task.save()

    return HttpResponseRedirect("/")






