<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Badge</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .badge {
            border: 2px solid #000;
            padding: 20px;
            width: 300px;
        }
    </style>
</head>

<body>
    <div class="badge">
        <h2>Airport Access Badge</h2>
        <p><strong>Badge Number:</strong> {{ $badge_number }}</p>
        <p><strong>Name:</strong> {{ $user->name }}</p>
        <p><strong>Zones:</strong> {{ $zones }}</p>
        <p><strong>Valid Until:</strong> {{ $valid_until }}</p>
    </div>
</body>

</html>