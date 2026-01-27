# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - img "NutriApp" [ref=e5]
      - generic [ref=e6]: NutriApp
    - navigation [ref=e7]:
      - link "Recetas" [ref=e8] [cursor=pointer]:
        - /url: /dishes
      - button "Logout" [ref=e10]
  - main [ref=e11]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - img [ref=e16]
        - generic [ref=e19]: NutriApp
      - heading "Bienvenido" [level=2] [ref=e20]
      - paragraph [ref=e21]: Inicia sesión para continuar
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Email
          - textbox "ejemplo@correo.com" [active] [ref=e25]
        - generic [ref=e26]:
          - generic [ref=e27]: Contraseña
          - textbox "Tu contraseña" [ref=e28]
        - button "Iniciar sesión" [ref=e29]
      - paragraph [ref=e30]:
        - text: ¿No tienes cuenta?
        - link "Regístrate" [ref=e31] [cursor=pointer]:
          - /url: /register
  - button "Open Next.js Dev Tools" [ref=e37] [cursor=pointer]:
    - img [ref=e38]
  - alert [ref=e41]
```