from django.http import HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from django.shortcuts import render
from .models import Task, Group


def task_list(request):
    tasks = Task.objects.all()
    tasks_with_id = [
        {
            "id": str(tasks[task_number]._id),
            "title": tasks[task_number].title,
            "completed": tasks[task_number].completed,
            "created_at": tasks[task_number].created_at,
            "group_id": tasks[task_number].group_id
        }
        for task_number in range(len(tasks))
    ]
    groups = Group.objects.all() # todo: split this endpoint for 2 separated
    groups_with_id = [
        {
            "id": str(groups[group_number]._id),
            "name": groups[group_number].name
        }
        for group_number in range(len(groups))
    ]
    return render(request, "todolist_list.html", {"tasks": tasks_with_id, "groups": groups_with_id})

@require_http_methods(["POST"])
def add(request):
    title_from_request = request.POST["title"]
    new_item = Task(title=title_from_request)
    new_item.save()
    return HttpResponseRedirect("/")

@require_http_methods(["DELETE"])
def delete(request, task_id):
    task_id_from_request = ObjectId(task_id)
    task = Task.objects.get(_id=task_id_from_request)
    task.delete()
    return HttpResponseRedirect("/")

@require_http_methods(["POST"])
def change_status(request, task_id):
    task_id_from_request = ObjectId(task_id)
    task = Task.objects.get(_id=task_id_from_request)

    task.completed = request.POST.get("completed") == "true"
    task.save()

    return HttpResponseRedirect("/")

@require_http_methods(["POST"])
def edit_title(request, task_id):
    task_id_from_request = ObjectId(task_id)
    task = Task.objects.get(_id=task_id_from_request)

    new_title = request.POST.get("title")
    task.title = new_title
    task.save()

    return HttpResponseRedirect("/")

@require_http_methods(["POST"])
def add_group(request):
    name_from_request = request.POST["name"]
    new_group = Group(name=name_from_request)
    new_group.save()
    return HttpResponseRedirect("/")

@require_http_methods(["POST"])
def update_group(request, task_id):
    task_id_from_request = ObjectId(task_id)
    task = Task.objects.get(_id=task_id_from_request)

    group_id = request.POST.get("group_id")
    if group_id:
        task.group_id = group_id
    else:
        task.group_id = None
    task.save()

    return HttpResponseRedirect("/")
