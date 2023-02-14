# Приложение "Список задач"
Приложение формирует список заданий, добавляемых пользователем. Все созданные задания загружаются в локальное хранилище LocalStorage и подгружаются из него.
Если хранилище пусто на первой странице отобразится строка "Список задач пуст". 



Так же данное приложение позволяет добавлять, удалять, редактировать и сотрировать список задач.

#Как пользоваться
1. Для добавления новой задачи необходимо кликнуть по кнопке "Создать новую задачу". В результате откроется новая страница.
![addTask](https://user-images.githubusercontent.com/92028919/218726428-a1455e29-fb99-4a1e-b400-40473c31fc04.JPG)

Пользователь вносит название задачи и ее текст в соответствующие поля. Дату начала задания и дату его окончания необходимо выбрать в календаре, который появится при клике в соответствующем поле ниже.
![kalendar](https://user-images.githubusercontent.com/92028919/218728110-6d04c597-731e-40a7-87f9-c1916514e148.JPG)

Далее необходимо кликнуть по кнопке "Добавить/изменить задачу". В результате появится окно с сообщением "Задача добавлена"
![taskHasAdded](https://user-images.githubusercontent.com/92028919/218729047-e52c2d28-3d8c-4132-8c15-575eb4f2407d.JPG)

При клике по кнопке ОК произойдет переход на первую страницу со списком всех задач, где пользователь увидит добавленную задачу.



2. На странице может отображаться сразу по 6 (изменяемый параметр) задач. При прокрутке вниз подгрузитятся следующие 6 задач. При достижении конца списка внизу будет надпись "Конец списка".

https://user-images.githubusercontent.com/92028919/218733740-3126d05d-63c1-413c-9abb-8c302e5dba52.mp4

Таким образом организована пагинация (динамическая подгрузка страниц при прокрутке вниз)

3. На первой странице можно отсортировать данные по названию, по дате начала, по дате окончания. После выбора параметра сортировки будет доступна пагинация на странице, но при выборе другого параметра сортировки она сбросится.

https://user-images.githubusercontent.com/92028919/218735497-0ee2c142-f631-4f03-a379-376fbb883fac.mp4




