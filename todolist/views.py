from django.http import JsonResponse
from bson import ObjectId
from django.shortcuts import render
from .models import Task, Group
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from enum import Enum

class TaskOperation(Enum):
    CHANGE_STATUS = "change_status"
    EDIT_TITLE = "edit_title"
    UPDATE_GROUP = "update_group"

class TaskView(APIView):
    def get(self, request):
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
        return JsonResponse(tasks_with_id, safe=False)


    def post(self, request):
        title_from_request = request.data.get("title")
        new_task = Task(title=title_from_request)
        new_task.save()
        return Response(status=status.HTTP_201_CREATED)

    def patch(self, request):
        task_id = request.data.get("task_id")
        task_id_as_object_id = ObjectId(task_id)
        task = Task.objects.get(_id=task_id_as_object_id)

        operation = request.data.get("operation")

        if operation == TaskOperation.CHANGE_STATUS.value:
            completed = request.data.get("completed")
            task.completed = completed
            task.save()
            return Response(status=status.HTTP_200_OK)

        elif operation == TaskOperation.EDIT_TITLE.value:
            new_title = request.data.get("title")
            task.title = new_title
            task.save()
            return Response(status=status.HTTP_200_OK)

        elif operation == TaskOperation.UPDATE_GROUP.value:
            group_id = request.data.get("group_id")
            if group_id:
                task.group_id = group_id
            else:
                task.group_id = None
            task.save()
            return Response(status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
        task_id = request.data.get("task_id")
        task_id_as_object_id = ObjectId(task_id)
        task = Task.objects.get(_id=task_id_as_object_id)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupView(APIView):
    def get(self, request):
        groups = Group.objects.all()
        groups_with_id = [
            {
                "id": str(groups[group_number]._id),
                "name": groups[group_number].name
            }
            for group_number in range(len(groups))
        ]
        return JsonResponse(groups_with_id,safe=False)

    def post(self, request):
        name_from_request = request.data.get("name")
        new_group = Group(name=name_from_request)
        new_group.save()
        return Response(status=status.HTTP_201_CREATED)


def render_main_page(request):
    return render(request, "todolist_list.html")

