"""
URL configuration for simple_todolist project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from todolist.views import add, delete, task_list, change_status, edit_title

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('', include('todolist.urls')),
    path("", task_list, name="task_list"),
    path("add", add),
    path("delete/<str:i>", delete),
    path("change_status/<str:i>", change_status),
    path("edit_title/<str:i>", edit_title)
]
