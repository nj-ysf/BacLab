from .models import Extraction
TEXTS = {
 'projectile_motion': 'Une balle est lancée avec une vitesse initiale de 20 m/s sous un angle de 45°. Déterminer la hauteur maximale et la portée.',
 'free_fall': 'Un objet est lâché sans vitesse initiale depuis une hauteur de 20 m. Déterminer son temps de chute.',
 'uniform_motion': 'Une voiture se déplace à une vitesse constante de 15 m/s pendant 10 secondes. Déterminer la distance parcourue.'}
VALUES = {
 'projectile_motion': {'initial_speed': (20,'m/s'), 'launch_angle': (45,'degree'), 'initial_height': (0,'m'), 'gravity': (9.81,'m/s²')},
 'free_fall': {'initial_height': (20,'m'), 'initial_velocity': (0,'m/s'), 'gravity': (9.81,'m/s²')},
 'uniform_motion': {'initial_position': (0,'m'), 'speed': (15,'m/s'), 'duration': (10,'s')}}
def demo(kind):
    return Extraction(supported=True,exercise_type=kind,language='fr',original_text=TEXTS[kind],summary=TEXTS[kind],parameters={k:dict(value=v,unit=u,confidence=0.8 if k in ('gravity','initial_position','initial_height') else 1,source_text=None) for k,(v,u) in VALUES[kind].items()},requested_outputs={'projectile_motion':['maximum_height','range'],'free_fall':['time_of_flight'],'uniform_motion':['distance']}[kind],missing_parameters=[],warnings=['Exemple prédéfini. Hypothèses : résistance de l’air négligée ; g = 9,81 m/s² ; origine au départ. Vérifiez la hauteur initiale.'])
