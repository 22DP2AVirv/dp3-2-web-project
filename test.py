import sys

# Проверяем, был ли передан аргумент
if len(sys.argv) > 1:
    input_value = sys.argv[1]
    # Выводим HTML с результатом
    print(f"Content-type: text/html\n")
    print(f"<h1>Вы ввели: {input_value}</h1>")
else:
    print("Content-type: text/html\n")
    print("<h1>Введите что-нибудь в форму</h1>")
